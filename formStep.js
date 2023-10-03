'use strict';
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator['throw'](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const __generator = (this && this.__generator) || function (thisArg, body) {
    let _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), 'throw': verb(1), 'return': verb(2) }, typeof Symbol === 'function' && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError('Generator is already executing.');
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.FormStep = void 0;
const readlineSync = require('readline-sync');
const fs = require('fs');
const path = require('path');
const FormStep = /** @class */ (function () {
    function FormStep(formTitle) {
        this.filePath = path.join(__dirname, 'cache.json');
        this.formTitle = formTitle;
    }
    FormStep.prototype.cacheRetrieval = function () {
        const jsonData = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(jsonData);
    };
    FormStep.prototype.setStatus = function () {
        const cache = this.cacheRetrieval();
        return this.status = cache.status;
    };
    FormStep.prototype.displayAnswers = function () {
        try {
            const cache = this.cacheRetrieval();
            cache.questions.forEach(function (element) {
                console.log(''.concat(element['contextParam'], ' : ').concat(element['answer']));
            });
        }
        catch (err) {
            console.error(err);
        }
    };
    FormStep.prototype.validation = function (obj) {
        let temp = '';
        // console.log('your obj:',obj)
        if (obj.validation) {
            for (let i = 1; i <= obj.validation.retryCount; i++) {
                temp = readlineSync.question(''.concat(obj['question'], ': '));
                const regexObject = new RegExp(obj.validation.regex);
                if (regexObject.test(temp)) {
                    return temp;
                }
                else if (i == obj.validation.retryCount) {
                    temp = false;
                    break;
                }
                else {
                    console.log(obj.validation.errorMessage);
                    continue;
                }
            }
        }
        else {
            return temp = readlineSync.question(''.concat(obj['question'], ': '));
        }
        return temp;
    };
    FormStep.prototype.checkForAsked = function () {
        return __awaiter(this, void 0, void 0, function () {
            let cache, questionEntry;
            return __generator(this, function (_a) {
                try {
                    cache = this.cacheRetrieval();
                    questionEntry = cache.questions.find(function (e) {
                        return e.asked == false;
                    });
                    return [2 /*return*/, questionEntry];
                }
                catch (error) {
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    FormStep.prototype.test = function () {
        return this.execute();
    };
    FormStep.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            let cache, questionEntry_1, answer, questionToUpdate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cacheRetrieval()];
                    case 1:
                        cache = _a.sent();
                        return [4 /*yield*/, this.setStatus()];
                    case 2:
                        _a.sent();
                        if (!(this.status == 'NEW' || this.status == 'PENDING')) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.checkForAsked()];
                    case 3:
                        questionEntry_1 = _a.sent();
                        if (!(questionEntry_1 == undefined)) return [3 /*break*/, 4];
                        this.status = 'EXECUTED';
                        try {
                            cache.status = 'EXECUTED';
                            fs.writeFileSync('cache.json', JSON.stringify(cache, null, 2), 'utf-8');
                            console.log('File has been written successfully!\n');
                            return [2 /*return*/, this.displayAnswers()];
                        }
                        catch (err) {
                            console.error('Error writing to the file:', err);
                        }
                        return [3 /*break*/, 7];
                    case 4:
                        answer = this.validation(questionEntry_1);
                        if (!(answer == false)) return [3 /*break*/, 5];
                        return [2 /*return*/, console.log(questionEntry_1.validation.failureFlow)];
                    case 5: return [4 /*yield*/, cache.questions.find(function (obj) { return obj.id == questionEntry_1.id; })];
                    case 6:
                        questionToUpdate = _a.sent();
                        if (questionToUpdate) {
                            questionToUpdate.answer = answer;
                            questionToUpdate.asked = true;
                            cache.status = 'PENDING';
                            fs.writeFileSync('cache.json', JSON.stringify(cache, null, 2), 'utf-8');
                            console.log('FILE WRITTEN');
                            return [2 /*return*/, this.test()];
                        }
                        else {
                            console.log('Object not found');
                        }
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return FormStep;
}());
exports.FormStep = FormStep;
const insta = new FormStep('Basic Info');
insta.execute();
