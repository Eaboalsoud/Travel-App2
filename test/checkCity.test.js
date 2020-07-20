import { checkCity } from "../src/client/js/checkCity"




describe("Testing the checkCity functionality", () => {
    
    test("Testing the checkCity function", () => {
       const input="london";
       const output=true;    
           expect(checkCity(input)).toBe(output);
})});
