package db

import (
	"encoding/json"
	"fmt"
	"time"

	"game-center-dynamic/server/internal/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Migrate performs auto-migration and seeds initial data if tables are empty.
func Migrate(database *gorm.DB) error {
	// Auto-migrate schemas
	if err := database.AutoMigrate(&model.Page{}, &model.PageComponent{}, &model.Game{}); err != nil {
		return fmt.Errorf("auto migrate: %w", err)
	}

	// Seed games if empty
	var count int64
	database.Model(&model.Game{}).Count(&count)
	if count == 0 {
		if err := seedGames(database); err != nil {
			return fmt.Errorf("seed games: %w", err)
		}
	}

	// Seed a default homepage if no pages exist
	database.Model(&model.Page{}).Count(&count)
	if count == 0 {
		if err := seedDefaultPage(database); err != nil {
			return fmt.Errorf("seed default page: %w", err)
		}
	}

	return nil
}

func seedGames(database *gorm.DB) error {
	now := time.Now().UnixMilli()
	games := []model.Game{
		{Name: "原神", Icon: "https://picsum.photos/seed/game1/200/200", Description: "在提瓦特大陆上展开冒险，探索七国，寻找失散的亲人。", Tags: toJSON([]string{"RPG", "开放世界", "冒险"}), Rating: 4.8, Category: "RPG"},
		{Name: "王者荣耀", Icon: "https://picsum.photos/seed/game2/200/200", Description: "5v5 MOBA竞技手游，与好友组队对战，感受团队配合的乐趣。", Tags: toJSON([]string{"MOBA", "竞技", "多人"}), Rating: 4.5, Category: "竞技"},
		{Name: "崩坏：星穹铁道", Icon: "https://picsum.photos/seed/game3/200/200", Description: "银河冒险RPG，搭乘星穹列车穿越星空，探索未知世界。", Tags: toJSON([]string{"RPG", "科幻", "回合制"}), Rating: 4.7, Category: "RPG"},
		{Name: "明日方舟", Icon: "https://picsum.photos/seed/game4/200/200", Description: "策略塔防手游，招募干员，制定战术，守护罗德岛。", Tags: toJSON([]string{"策略", "塔防", "卡牌"}), Rating: 4.6, Category: "策略"},
		{Name: "蛋仔派对", Icon: "https://picsum.photos/seed/game5/200/200", Description: "欢乐休闲竞技手游，可爱的蛋仔们展开刺激的闯关对决。", Tags: toJSON([]string{"休闲", "竞技", "派对"}), Rating: 4.3, Category: "休闲"},
		{Name: "和平精英", Icon: "https://picsum.photos/seed/game6/200/200", Description: "百人空降竞技手游，在超大地图上生存到最后。", Tags: toJSON([]string{"射击", "竞技", "生存"}), Rating: 4.4, Category: "射击"},
		{Name: "阴阳师", Icon: "https://picsum.photos/seed/game7/200/200", Description: "和风卡牌RPG，收集式神，体验京都的奇幻故事。", Tags: toJSON([]string{"卡牌", "RPG", "和风"}), Rating: 4.5, Category: "卡牌"},
		{Name: "第五人格", Icon: "https://picsum.photos/seed/game8/200/200", Description: "非对称对抗竞技手游，1v4的紧张追逐体验。", Tags: toJSON([]string{"竞技", "悬疑", "非对称"}), Rating: 4.2, Category: "竞技"},
		{Name: "光·遇", Icon: "https://picsum.photos/seed/game9/200/200", Description: "温暖治愈的社交冒险手游，在云端王国中结识朋友。", Tags: toJSON([]string{"冒险", "社交", "治愈"}), Rating: 4.6, Category: "冒险"},
		{Name: "梦幻西游", Icon: "https://picsum.photos/seed/game10/200/200", Description: "经典回合制MMORPG，重温西游世界的冒险旅程。", Tags: toJSON([]string{"RPG", "回合制", "经典"}), Rating: 4.3, Category: "RPG"},
		{Name: "英雄联盟手游", Icon: "https://picsum.photos/seed/game11/200/200", Description: "经典MOBA手游版，随时随地畅享峡谷对决。", Tags: toJSON([]string{"MOBA", "竞技", "策略"}), Rating: 4.6, Category: "竞技"},
		{Name: "荒野行动", Icon: "https://picsum.photos/seed/game12/200/200", Description: "战术竞技射击手游，跳伞空降，搜刮装备，生存至最后。", Tags: toJSON([]string{"射击", "生存", "竞技"}), Rating: 4.1, Category: "射击"},
		{Name: "QQ飞车", Icon: "https://picsum.photos/seed/game13/200/200", Description: "竞速手游，驾驶酷炫赛车，在赛道上极速飞驰。", Tags: toJSON([]string{"竞速", "休闲", "竞技"}), Rating: 4.2, Category: "竞速"},
		{Name: "崩坏3", Icon: "https://picsum.photos/seed/game14/200/200", Description: "3D动作手游，操控女武神，体验爽快的连击战斗。", Tags: toJSON([]string{"动作", "科幻", "二次元"}), Rating: 4.5, Category: "动作"},
		{Name: "部落冲突", Icon: "https://picsum.photos/seed/game15/200/200", Description: "策略经营手游，建设村庄，训练军队，征战四方。", Tags: toJSON([]string{"策略", "模拟", "经营"}), Rating: 4.4, Category: "策略"},
		{Name: "开心消消乐", Icon: "https://picsum.photos/seed/game16/200/200", Description: "经典消除手游，轻松上手，随时随地来一局。", Tags: toJSON([]string{"休闲", "消除", "益智"}), Rating: 4.0, Category: "休闲"},
		{Name: "金铲铲之战", Icon: "https://picsum.photos/seed/game17/200/200", Description: "自走棋策略竞技手游，搭配阵容，运筹帷幄。", Tags: toJSON([]string{"策略", "自走棋", "竞技"}), Rating: 4.3, Category: "策略"},
		{Name: "碧蓝航线", Icon: "https://picsum.photos/seed/game18/200/200", Description: "战舰拟人即时海战手游，收集舰娘，组建最强舰队。", Tags: toJSON([]string{"卡牌", "养成", "海战"}), Rating: 4.4, Category: "卡牌"},
		{Name: "我的世界", Icon: "https://picsum.photos/seed/game19/200/200", Description: "沙盒创造手游，无限世界，自由建造你的梦想。", Tags: toJSON([]string{"沙盒", "创造", "模拟"}), Rating: 4.7, Category: "模拟"},
		{Name: "穿越火线：枪战王者", Icon: "https://picsum.photos/seed/game20/200/200", Description: "FPS射击手游，多种模式，枪战对抗的快感。", Tags: toJSON([]string{"射击", "FPS", "竞技"}), Rating: 4.1, Category: "射击"},
	}

	for i := range games {
		games[i].ID = uuid.New().String()
		games[i].CreatedAt = now
		games[i].UpdatedAt = now
	}

	return database.Create(&games).Error
}

func seedDefaultPage(database *gorm.DB) error {
	now := time.Now().UnixMilli()
	pageID := uuid.New().String()

	page := model.Page{
		ID:        pageID,
		Name:      "首页",
		Slug:      "home",
		Status:    "published",
		Version:   1,
		CreatedAt: now,
		UpdatedAt: now,
	}

	components := []map[string]interface{}{
		{
			"id":    uuid.New().String(),
			"type":  "Banner",
			"order": 0,
			"props": map[string]interface{}{
				"slides": []map[string]string{
					{"image": "https://picsum.photos/seed/banner1/800/300", "title": "热门游戏推荐", "link": "/games/hot"},
					{"image": "https://picsum.photos/seed/banner2/800/300", "title": "新游上线", "link": "/games/new"},
					{"image": "https://picsum.photos/seed/banner3/800/300", "title": "限时活动", "link": "/events"},
				},
			},
		},
		{
			"id":    uuid.New().String(),
			"type":  "GameList",
			"order": 1,
			"props": map[string]interface{}{
				"title":    "热门游戏",
				"limit":    8,
				"layout":   "grid",
				"dataSource": map[string]interface{}{
					"type":   "filter",
					"sortBy": "rating",
					"limit":  8,
				},
			},
		},
		{
			"id":    uuid.New().String(),
			"type":  "GameList",
			"order": 2,
			"props": map[string]interface{}{
				"title":  "休闲游戏",
				"limit":  4,
				"layout": "horizontal",
				"dataSource": map[string]interface{}{
					"type": "filter",
					"tags": "休闲",
					"limit": 4,
				},
			},
		},
		{
			"id":    uuid.New().String(),
			"type":  "TagNav",
			"order": 3,
			"props": map[string]interface{}{
				"categories": []string{"RPG", "卡牌", "休闲", "动作", "策略", "模拟", "竞速", "射击"},
			},
		},
	}

	componentsJSON, err := json.Marshal(components)
	if err != nil {
		return fmt.Errorf("marshal components: %w", err)
	}

	pc := model.PageComponent{
		ID:         uuid.New().String(),
		PageID:     pageID,
		Version:    1,
		Components: string(componentsJSON),
		CreatedAt:  now,
	}

	if err := database.Create(&page).Error; err != nil {
		return err
	}
	return database.Create(&pc).Error
}

func toJSON(v interface{}) string {
	b, _ := json.Marshal(v)
	return string(b)
}