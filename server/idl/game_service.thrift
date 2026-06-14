include "common.thrift"

namespace go gamecenter

service GameService {
  list<common.GameInfo> ListGames(1: string tags, 2: string sortBy, 3: i32 limit),
  list<common.GameInfo> BatchGetGames(1: list<string> ids),
  list<string> ListTags(),
}