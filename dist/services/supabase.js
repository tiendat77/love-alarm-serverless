"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
class Supabase {
    constructor() {
        const supabaseUrl = process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co';
        const supabaseKey = process.env.SUPABASE_KEY || 'public-anon-key';
        this.client = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
        console.log(`🦸 [Supabase] Initialized Supabase client`);
    }
    getToken(id) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const { data, error, status } = yield this.client
                .from('tokens')
                .select('id,notification')
                .eq('id', id)
                .single();
            if (error && status !== 406) {
                reject(error);
            }
            else {
                resolve(data);
            }
        }));
    }
    getProfile(id, fields) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const select = fields && fields.length ? fields.join(', ') : '*';
            const { data, error, status } = yield this.client
                .from('profiles')
                .select(select)
                .eq('id', id)
                .single();
            if (error && status !== 406) {
                reject(error);
            }
            else {
                resolve(data);
            }
        }));
    }
    updateProfile(profile) {
        const update = Object.assign(Object.assign({}, profile), { id: profile.id, updated_at: new Date() });
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.client
                .from('profiles')
                .upsert(update, {
                returning: 'minimal'
            });
            if (error) {
                reject(error);
            }
            else {
                resolve(data);
            }
        }));
    }
}
exports.default = new Supabase();
