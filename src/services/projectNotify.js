import { notification } from "antd";
import { dispatchDomainTypeEffect } from "./project";
import * as projectWorkers from "./projectWorkers";
const domainTypeWorkers = {};

// handle notify
export function handle(dispatch, type, details) {
  switch (type) {
    case "my_handling.project":
      if (details.isFailed) {
        // 获取扩展信息失败了
        notification.error({
          placement: "bottomRight",
          message: "获取扩展信息失败",
          description: <pre>{JSON.stringify(details, undefined, 2)}</pre>
        });
      } else {
        // 更新项目信息
        projectWorkers.fetchProjectItem(details, { dispatch }, details.projectID);
      }
      break;
    case "my_handling.sessions":
      // 更新会话信息
      if (details.sessionID) {
        projectWorkers.fetchSessionItem(details, { dispatch }, details.sessionID);
      } else {
        projectWorkers.fetchMyHandlingSessions(details, { dispatch });
      }
      break;
    case "my_handling.session.transferred":
      notification.info({
        placement: "bottomRight",
        message: "会话被转接",
        description: <pre>JSON.stringify(details, undefined, 2)}</pre>
      });
    case "my_handling.session.finished":
      dispatchDomainTypeEffect(details, { dispatch }, "myHandling/removeHandlingSession", {
        sessionID: details.sessionID
      });
      break;
    case "msgs":
      projectWorkers.fetchProjectMsgs(details, { dispatch }, details.projectID);
      break;
  }
}
