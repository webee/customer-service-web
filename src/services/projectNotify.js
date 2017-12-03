import * as projectWorkers from "./projectWorkers";
const domainTypeWorkers = {};

// handle notify
export function handle(dispatch, type, details) {
  switch (type) {
    case "my_handling.sessions":
      // 更新会话信息
      if (details.sessionID) {
        projectWorkers.fetchSessionItem(details, { dispatch }, details.sessionID);
      } else {
        projectWorkers.fetchMyHandlingSessions(details, { dispatch });
      }
      break;
    case "my_handling.session.finished":
      projectWorkers.dispatchDomainTypeEffect(details, { dispatch }, "myHandling/removeHandlingSession", {
        sessionID: details.sessionID
      });
      break;
    case "msgs":
      projectWorkers.fetchProjectMsgs(details, { dispatch }, details.projectID);
      break;
  }
}
