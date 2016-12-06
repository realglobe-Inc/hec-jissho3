module.exports = {
  REST_URL: {
    OF_CAMERA: {
      CAMERAS: '/rest/cameras',
      CAMERA : '/rest/cameras/:camera_uuid',
      PHOTOS : '/rest/cameras/:camera_uuid/photos',
      PHOTO  : '/rest/cameras/:camera_uuid/photos/:photo_uuid',
      PHOTO_LIST: '/rest/cameras/:camera_uuid/photolist'
    },

    OF_REPORT: {
      // REPORTS      : '/rest/reports',
      OPEN_REPORTS : '/rest/reports/open',
      // OPEN_REPORT  : '/rest/reports/open/:report_full_id',
      CLOSE_REPORTS: '/rest/reports/close',
      CLOSE_REPORT : '/rest/reports/close/:report_full_id'
    }
  },

  SUGOS_URL: {
    REPORT_PATH: '/sugos/report/socket.io',
    UI_PATH: '/sugos/ui/socket.io'
  },

  SUGOS: {
    // Camera
    PHOTO_MONITOR_ACTOR: {
      KEY: 'camera:photo-monitor',
      MODULE: 'photo-monitor',
      CREATED_EVENT: 'created',
      REMOVED_EVENT: 'removed'
    },
    // Reporter
    REPORTER_MODULE: 'reporter', // 通報を送る側
    MASTER_ACTOR: {
      KEY: 'qq:master-reporter',
      MODULE: 'master-reporter',
      NEW_REPORT_EVENT: 'new-report',
      REPORT_INFO_EVENT: 'report-info'
    },
    // DataSyncer
    DATA_SYNC_ACTOR: {
      KEY: 'qq:data-syncer',
      MODULE: 'data-syncer',
      UPDATE_EVENT: 'update'
    }
  }
}
