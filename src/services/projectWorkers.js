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

function clearExpiredWorkers() {
  // TODO:
}

export function fetchMyHandlingSessions({ projectDomain, projectType }, { dispatch }, params = {}) {
  const taskName = fetchMyHandlingSessions.name;
  const worker = getWorker(taskName, [projectDomain, projectType, fetchMyHandlingSessions], async (params) => {
    await dispatchDomainTypeEffect({ projectDomain, projectType }, { dispatch }, "myHandling/fetchSessions", params);
    await delay(100);
  });
  worker.start(params);
}

export function fetchSessionItem({ projectDomain, projectType }, { dispatch }, sessionID) {
  const taskName = fetchSessionItem.name;
  const worker = getWorker(taskName, [projectDomain, projectType, fetchSessionItem, sessionID], async () => {
    await dispatchDomainTypeEffect(
      { projectDomain, projectType },
      { dispatch },
      "myHandling/fetchSessionItem",
      sessionID
    );
    await delay(100);
  });
  worker.start();
}

export function fetchProjectItem({ projectDomain, projectType }, { dispatch }, projectID) {
  const taskName = fetchProjectItem.name;
  const worker = getWorker(taskName, [projectDomain, projectType, fetchProjectItem, projectID], async () => {
    await dispatchDomainTypeEffect(
      { projectDomain, projectType },
      { dispatch },
      "myHandling/fetchProjectItem",
      projectID
    );
  });
  worker.start();
}

export function loadProjectMsgs({ projectDomain, projectType }, { dispatch }, projectID, limit = 100) {
  const taskName = fetchProjectMsgs.name;
  const worker = getWorker(taskName, [projectDomain, projectType, loadProjectMsgs, projectID], async limit => {
    await dispatchDomainTypeEffect({ projectDomain, projectType }, { dispatch }, "_/loadProjectHistoryMsgs", {
      projectID,
      limit
    });
    await delay(100);
  });
  worker.start(limit);
}

export function fetchProjectMsgs({ projectDomain, projectType }, { dispatch }, projectID) {
  const taskName = fetchProjectMsgs.name;
  const worker = getWorker(taskName, [projectDomain, projectType, fetchProjectMsgs, projectID], async () => {
    await dispatchDomainTypeEffect({ projectDomain, projectType }, { dispatch }, "_/fetchProjectNewMsgs", {
      projectID
    });
    await delay(100);
  });
  worker.start();
}

export function syncSessionMsgID({ projectDomain, projectType }, { dispatch }, projectID, sessionID, sync_msg_id) {
  const taskName = syncSessionMsgID.name;
  const worker = getWorker(
    taskName,
    [projectDomain, projectType, fetchProjectMsgs, projectID, sessionID],
    async sync_msg_id => {
      await dispatchDomainTypeEffect({ projectDomain, projectType }, { dispatch }, "_/syncSessionMsgID", {
        projectID,
        sessionID,
        sync_msg_id
      });
      await delay(100);
    },
    sync_msg_id
  );
  worker.start(sync_msg_id, (prevMsgID, msgID) => {
    return msgID > prevMsgID ? msgID : prevMsgID;
  });
}
