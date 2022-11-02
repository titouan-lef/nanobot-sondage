const reqString = {
    type: String,
    required: true
};

const reqNumber = {
    type: Number,
    required: true
};

const reqBoolean = {
    type: Boolean,
    required: true
};

const reqObject = {
    type: Object,
    required: true
};


module.exports =
{
    getString: () => {
        return reqString;
    },

    getNumber: () => {
        return reqNumber;
    },

    getBoolean: () => {
        return reqBoolean;
    },

    getObject: () => {
        return reqObject;
    }
};