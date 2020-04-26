import {NzxProvider} from "@modules/nzx/nzx.provider";

export default {
    Query: {
        priceToday: (root, {input: {codes}}, {injector}) =>
            injector.get(NzxProvider).getDailyPrice(codes)
    },

    Price: {
        timestamp: bucket => bucket.bucket,
        code: bucket => bucket.code,
        avg: bucket => bucket.price_avg,
        max: bucket => bucket.price_max,
        min: bucket => bucket.price_min
    }
}