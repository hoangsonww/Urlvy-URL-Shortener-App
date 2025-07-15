"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const configuration_1 = __importDefault(require("./src/config/configuration"));
const url_entity_1 = require("./src/url/entities/url.entity");
const click_entity_1 = require("./src/click/entities/click.entity");
const config = new config_1.ConfigService((0, configuration_1.default)());
exports.default = new typeorm_1.DataSource({
  type: "postgres",
  url: config.getOrThrow("databaseUrl"),
  entities: [url_entity_1.Url, click_entity_1.Click],
  migrations: ["migrations/*.ts"],
  synchronize: false,
});
//# sourceMappingURL=ormconfig.js.map
