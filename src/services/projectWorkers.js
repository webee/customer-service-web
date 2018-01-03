import { SingletonWorker } from "../utils/notify";
import { delay } from "../utils/commons";
import { dispatchDomainTypeEffect } from "./project";

const domainTypeWorkers = {};

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
    await dispatchDomainTypeEffect(
      { projectDomain, projectType },
      { dispatch },
      "myHandling/fetchSessionItem",
      sessionID
    );
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


export function syncSessionMsgID({ projectDomain, projectType }, { dispatch }, projectID, sessionID, sync_msg_id) {
  console.log('xxxxxxxxxxxxx');
  const taskName = syncSessionMsgID.name;
  const worker = getWorker(taskName, [projectDomain, projectType, fetchProjectMsgs, projectID, sessionID], async (sync_msg_id) => {
    await delay(100);
    await dispatchDomainTypeEffect({ projectDomain, projectType }, { dispatch }, "_/syncSessionMsgID", {
      projectID, sessionID, sync_msg_id
    });
  }, sync_msg_id);
  worker.start(sync_msg_id, (prevMsgID, msgID) => {
    return msgID > prevMsgID ? msgID : prevMsgID;
  });
}
