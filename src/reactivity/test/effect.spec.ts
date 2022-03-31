import { effect, stop } from "../effect";
import { reactive } from "../reactive";

describe('effect', () => {
    it('reactive test', () => {
        const user = reactive({ age: 25 });
        let nextAge = null;
        effect(() => {
            nextAge = user.age + 1;
        })
        expect(nextAge).toBe(26);

        //update
        user.age++;
        expect(nextAge).toBe(27);
    })

    it('should return a runner when call effect', () => {
        let num = 10;
        const runner = effect(() => {
            num++;
            return 'test';
        });
        expect(num).toBe(11);
        const res = runner();
        expect(num).toBe(12);
        expect(res).toBe('test');
    })

    it('scheduler', () => {
        let dummy;
        let run: any;
        const scheduler = jest.fn(() => {
            run = runner;
        });
        const obj = reactive({ foo: 1 });
        const runner = effect(() => {
            dummy = obj.foo;
        }, { scheduler });
        expect(scheduler).not.toHaveBeenCalled();
        expect(dummy).toBe(1);
        obj.foo++;
        expect(scheduler).toHaveBeenCalledTimes(1);
        expect(dummy).toBe(1);
        run();
        expect(dummy).toBe(2);
    })

    it('stop', () => {
        let dummy;
        const obj = reactive({ prop: 1 });
        const runner = effect(() => {
            dummy = obj.prop;
        });
        obj.prop = 2;
        expect(dummy).toBe(2);
        stop(runner);
        obj.prop = 3;
        expect(dummy).toBe(2);
        runner();
        expect(dummy).toBe(3);
    })

    it('onStop', () => {
        const obj = reactive({ foo: 1});
        const onStop = jest.fn();
        let dummy;
        const runner = effect(() => {
            dummy = obj.foo;
        }, { onStop });
        stop(runner);
        expect(onStop).toBeCalledTimes(1);
    });
})