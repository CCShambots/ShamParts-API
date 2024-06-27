"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationCategories = void 0;
const NotificationTypes_1 = require("./NotificationTypes");
exports.notificationCategories = {
    [NotificationTypes_1.ASSIGNMENT]: {
        type: "%Name%",
        template: "assigned a part!",
        path: '/partDetailScreen'
    },
    [NotificationTypes_1.FULFILLED]: {
        type: "%Name%",
        template: "fulfilled a part!",
        path: '/partDetailScreen'
    },
    [NotificationTypes_1.READY]: {
        type: "%Name%",
        template: "got a part ready!",
        path: '/partDetailScreen'
    }
};
//# sourceMappingURL=NotificationCategories.js.map