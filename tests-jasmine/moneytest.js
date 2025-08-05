import { formatCurrency } from "../scripts/utils.js";

describe('test suite : format currency',()=>{
    it('convert cents into dollar',()=>{
        expect(formatCurrency(2095)).toEqual('20.95');
    });
});