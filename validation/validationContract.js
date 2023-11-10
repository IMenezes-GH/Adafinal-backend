let errors = [];

export default class ValidationContract {
    constructor() {
        errors = [];
    }
    isRequired(value, message) {
        if (!value || value.length <= 0)
            errors.push({ message: message });
    }
    hasMinLen(value, min, message) {
        if (!value || value.length < min)
            errors.push({ message: message });
    }
    hasMaxLen(value, max, message) {
        if (!value || value.length > max)
            errors.push({ message: message });
    }
    isFixedLen(value, len, message) {
        if (value.length != len)
            errors.push({ message: message });
    }
    isNotEquals(value, other, message) {
        if (value != other)
            errors.push({ message: message });
    }
    isEmail(value, message) {
        var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
        if (!reg.test(value))
            errors.push({ message: message });
    }
    errors() {
        return errors;
    }
    clear() {
        errors = [];
    }
    isValid() {
        return errors.length == 0;
    }
    isOlder(value, min, message){
        if (!value) {return}
        const data = value.split('-');
        const parsedDate = new Date(Number(data[0])+min, Number(data[1])-1, Number(data[2]))
        if (!value || parsedDate >= new Date()){
            errors.push({message: message})

        };
    }
}
