import { SingletonWorker } from "../utils/notify";
import { dispatchDomainTypeEffect } from "./project";

const domainTypeWorkers = {};

// handle notify
export function handle(dispatch, type, details) {
  switch (type) {
    case "my_handling.sessions":
      // 更新会话信息
      const { sessionID } = details;
      fetchMyHandlingSessions(details, { dispatch }, sessionID)
      break;
    case "msgs":
      fetchProjectMsgs(details, { dispatch }, details.projectID);
      break;
  }
}

function getWorker(key, f, ...args) {
  let worker = domainTypeWorkers[key];
  if (!worker) {
    worker = new SingletonWorker(f, ...args);
    domainTypeWorkers[key] = worker;
  }
  return worker;
}

export function fetchMyHandlingSessions({ projectDomain, projectType }, { dispatch }, sessionID) {
  const worker = getWorker([projectDomain, projectType, fetchMyHandlingSessions], () => {
    if (sessionID) {
      dispatchDomainTypeEffect({ projectDomain, projectType }, { dispatch }, "_/fetchSessionItem", sessionID);
    } else {
      dispatchDomainTypeEffect({ projectDomain, projectType }, { dispatch }, "myHandling/fetchSessions");
    }
  });
  worker.start();
}

export function fetchProjectMsgs({ projectDomain, projectType }, { dispatch }, projectID) {
  const worker = getWorker([projectDomain, projectType, fetchProjectMsgs, projectID], () => {
    dispatchDomainTypeEffect({ projectDomain, projectType }, { dispatch }, "_/fetchProjectNewMsgs", {
      projectID
    });
  });
  worker.start();
}
