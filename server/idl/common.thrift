namespace go gamecenter

struct GameInfo {
  1: string id,
  2: string name,
  3: string icon,
  4: string description,
  5: list<string> tags,
  6: double rating,
  7: string category,
}

struct PageComponent {
  1: string id,
  2: string type,
  3: i32 order,
  4: string propsJson,
}

struct PageSchema {
  1: string id,
  2: string name,
  3: string slug,
  4: i32 version,
  5: string status,
  6: list<PageComponent> components,
  7: i64 createdAt,
  8: i64 updatedAt,
}