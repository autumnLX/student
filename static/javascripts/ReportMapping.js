//stageId对应的报告模板
var _mapping = {
};

var ReportMapping = (function (mapping) {
    return {
        exit: function (stageId) {
            return !!mapping[stageId];
        },
        getArea: function (stageId) {
            return mapping[stageId].area;
        },
        getController: function (stageId, groupId, studentId) {
            return mapping[stageId].controller + "/getReport?stageId=" + stageId + "&groupId=" + groupId + (studentId ? ("&studentId=" + studentId) : "") + "&area=" + mapping[stageId].area;
        },
        getReportUrl: function (type, stageId, groupId, paperId, studentId) {
            return "/web/models/Report/" + (mapping[stageId] ? mapping[stageId].tpl + "/" + type : "default") + "/self.php?gId=" + groupId + "&sId=" + stageId + (paperId ? ("&pId=" + paperId) : "") + (studentId ? ("&studentId=" + studentId) : "");
        },
        getReportMapping: function (stageId) {
            return mapping[stageId];
        }
    }
})(_mapping);