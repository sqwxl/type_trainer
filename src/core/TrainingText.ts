import { sanitizeStringForGlyphs } from "../utils/text-utils";
import { Language } from "./Language";

export default class TrainingText {
    private _sanitized: string
    constructor(private _raw: string, language: Language) {
        this._sanitized = sanitizeStringForGlyphs(this._raw, language.uniqueGlyphs)
    }
    get text() {
        return this._sanitized
    }
    get raw() {
        return this._raw
    }
}