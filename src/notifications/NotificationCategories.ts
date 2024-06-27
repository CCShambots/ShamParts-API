import {ASSIGNMENT, FULFILLED, READY} from "./NotificationTypes";

export const notificationCategories = {
    [ASSIGNMENT]: {
        type: "%Name%",
        template: "assigned a part!",
        path: '/partDetailScreen'
    },
    [FULFILLED]: {
        type: "%Name%",
        template: "fulfilled a part!",
        path: '/partDetailScreen'
    },
    [READY]: {
        type: "%Name%",
        template: "got a part ready!",
        path: '/partDetailScreen'
    }
}