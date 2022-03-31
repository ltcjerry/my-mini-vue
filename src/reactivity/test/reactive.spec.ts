import { reactive } from "../reactive";

describe('reactive', () => {
    it('reactive test', () => {
        const original = {num: 1};
        const observer = reactive(original);
        expect(observer).not.toBe(original);
        expect(observer.num).toBe(1);
    });
});