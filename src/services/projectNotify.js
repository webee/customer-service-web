import { SingletonWorker } from "../utils/notify";
import { delay } from "../utils/commons";
import { dispatchDomainTypeEffect } from "./project";

const domainTypeWorkers = {};

// handle notify
export function handle(dispatch, type, details) {
  switch (type) {
    case "my_handling.sessions":
      // 更新会话信息
      const { sessionID } = details;
      if (sessionID) {
        fetchSessionItem(details, { dispatch }, sessionID);
      } else {
        fetchMyHandlingSessions(details, { dispatch });
      }
      break;
    case "msgs":
      fetchProjectMsgs(details, { dispatch }, details.projectID);
      break;
  }
}

function getWorker(name, key, f, ...args) {
  // TODO: 记录使用时间，为以后可能的清理缓存作准备
  let { worker } = domainTypeWorkers[key] || {};
  if (!worker) {
    worker = new SingletonWorker(name, f, ...args);
    domainTypeWorkers[key] = { worker };
  }
  domainTypeWorkers[key].ts = new Date();
  return worker;
}

export function fetchMyHandlingSessions({ projectDomain, projectType }, { dispatch }) {
  const taskName = fetchMyHandlingSessions.name;
  const worker = getWorker(taskName, [projectDomain, projectType, fetchMyHandlingSessions], async () => {
    await delay(100);
    await dispatchDomainTypeEffect({ projectDomain, projectType }, { dispatch }, "myHandling/fetchSessions");
  });
  worker.start();
}

export function fetchSessionItem({ projectDomain, projectType }, { dispatch }, sessionID) {
  const taskName = fetchSessionItem.name;
  const worker = getWorker(taskName, [projectDomain, projectType, fetchSessionItem, sessionID], async () => {
    await delay(100);
    await dispatchDomainTypeEffect({ projectDomain, projectType }, { dispatch }, "_/fetchSessionItem", sessionID);
  });
  worker.start();
}

export function fetchProjectMsgs({ projectDomain, projectType }, { dispatch }, projectID) {
  const taskName = fetchProjectMsgs.name;
  const worker = getWorker(taskName, [projectDomain, projectType, fetchProjectMsgs, projectID], async () => {
    await delay(100);
    await dispatchDomainTypeEffect({ projectDomain, projectType }, { dispatch }, "_/fetchProjectNewMsgs", {
      projectID
    });
  });
  worker.start();
}
