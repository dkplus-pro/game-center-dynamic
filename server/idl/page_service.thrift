include "common.thrift"

namespace go gamecenter

service PageService {
  list<common.PageSchema> ListPages(),
  common.PageSchema GetPage(1: string slug, 2: bool resolve),
  common.PageSchema CreatePage(1: string name, 2: string slug),
  common.PageSchema UpdatePage(1: common.PageSchema page),
  bool PublishPage(1: string pageId),
  bool DeletePage(1: string pageId),
}