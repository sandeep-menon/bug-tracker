const mongoose = require("mongoose");

const DefectSchema = mongoose.Schema({
    DefDate: {
        type: Date,
        default: Date.now,
    },
    DefLastDate: {
        type: Date,
    },
    DefCreatedBy: {
        type: String,
    },
    DefSummary: {
        type: String,
    },
    DefDescription: {
        type: String,
    },
    DefStatus: {
        type: String,
        enum: ["Open", "Fix in progress", "Ready for Test", "Test in progress", "Closed", "Reopened"],
        default: "Open"
    },
    DefAssigned: {
        DefAssignedToName: {
            type: String,
            default: "",
        },
        DefAssignedToId: {
            type: String,
            default: "",
        }
    }, 
    DefComments: [
        {
            DefCommentName: {
                type: String,
            },
            DefCommentDate: {
                type: Date,
                default: Date.now,
            },
            DefCommentContent: {
                type: String,
            }
        }
    ],
    DefHistory: [
        {
            DefHistoryDetail : {
                type: String,
            },
            DefHistoryDate: {
                type: Date,
                default: Date.now,
            }
        }
    ]
});

module.exports = mongoose.model("Defect", DefectSchema);