interface Req {
    type: StringConstructor | NumberConstructor | BooleanConstructor | ObjectConstructor;
    required: boolean;
    set?: Function;
}

const reqString: Req = {
    type: String,
    required: true
};

const reqStringVide: Req = {
    type: String,
    required: false,
    set: (v: string) => v === '' ? null : v
};

const reqNumber: Req = {
    type: Number,
    required: true
};

const reqBoolean: Req = {
    type: Boolean,
    required: true
};

const reqObject: Req = {
    type: Object,
    required: true
};


export default
{
    getString: (): const => {
        return reqString;
    },

    getStringVide: (): const => {
        return reqStringVide;
    },

    getNumber: (): const => {
        return reqNumber;
    },

    getBoolean: (): const => {
        return reqBoolean;
    },

    getObject: (): const => {
        return reqObject;
    }
} as const;