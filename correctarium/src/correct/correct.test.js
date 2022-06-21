const Correct = require('./correct');

describe('Correct funcs:', () => {

    const corr = new Correct();
    test('Kyiv time +3 UTC', () => {
        expect(new Date(corr.getKyivTimestamp()).getHours() - new Date().getHours()).toBe(3);
    });

    describe('Price func:', () => {
        test('MIN symbol count "EN" equals 120 UAH (.DOC, .DOCX, .PDF)', () => {
            expect(corr.getPrice('en', 1000, 'doc')).toEqual('120.00');
        });
        test('MIN symbol count "EN" equals 120 UAH + 20% (.OTHER etc)', () => {
            expect(corr.getPrice('en', 1000, 'other')).toEqual((120 * 1.2).toFixed(2));
        });
        test('Count 1000+ symbols "EN" equals count * 0.12 (.DOC, .DOCX, .RTF)', () => {
            expect(corr.getPrice('en', 1001, 'doc')).toEqual((1001 * 0.12).toFixed(2));
        });
        test('Count 1000+ symbols "EN" equals (count + 20%) * 0.12 (.OTHER etc)', () => {
            expect(corr.getPrice('en', 1001, 'other')).toEqual((1001 * 1.2 * 0.12).toFixed(2));
        });

        test('MIN symbol count "UA/RU" equals 50 UAH (.DOC, .DOCX, .RTF)', () => {
            expect(corr.getPrice('ua', 1000, 'doc')).toEqual('50.00');
        });
        test('MIN symbol count "UA/RU" equals 50 UAH + 20% (.OTHER etc)', () => {
            expect(corr.getPrice('ua', 1000, 'other')).toEqual((50 * 1.2).toFixed(2));
        });
        test('Count 1000+ symbols "UA/RU" equals count * 0.05 (.DOC, .DOCX, .RTF)', () => {
            expect(corr.getPrice('ua', 1001, 'doc')).toEqual((1001 * 0.05).toFixed(2));
        });
        test('Count 1000+ symbols "UA/RU" equals (count + 20%) * 0.05 (.OTHER etc)', () => {
            expect(corr.getPrice('ua', 1001, 'other')).toEqual((1001 * 1.2 * 0.05).toFixed(2));
        });

        test('Multiple price equals multiple single', () => {
            expect(Number(corr.getPrice('ua', 1001, 'doc|docx'))).toEqual(Number(corr.getPrice('ua', 1001, 'doc')) + Number(corr.getPrice('ua', 1001, 'docx')));
        });
    });

    describe('Work time func:', () => {
        test('MIN symbol count "EN" equals 60 min (.DOC, .DOCX, .PDF)', () => {
            expect(corr.getWorkTimestamp('en', 333, 'doc')).toEqual(60 * 60 * 1000);
        });
        test('MIN symbol count "EN" equals 60 min + 20% (.OTHER etc)', () => {
            expect(corr.getWorkTimestamp('en', 333, 'other')).toEqual(60 * 60 * 1000 * 1.2);
        });
        test('Count 333+ symbols "EN" equals 30 min + count / 5.55  (.DOC, .DOCX, .RTF)', () => {
            expect(corr.getWorkTimestamp('en', 334, 'doc')).toEqual(Math.ceil((30 + 334 / 5.55) * 60 * 1000));
        });
        test('Count 333+ symbols "EN" equals (30 min + count / 5.55) + 20% (.OTHER etc)', () => {
            expect(corr.getWorkTimestamp('en', 334, 'other')).toEqual(Math.ceil((30 + 334 / 5.55) * 1.2 * 60 * 1000));
        });

        test('MIN symbol count "UA/RU" equals 60 min (.DOC, .DOCX, .PDF)', () => {
            expect(corr.getWorkTimestamp('ua', 1333, 'doc')).toEqual(60 * 60 * 1000);
        });
        test('MIN symbol count "UA/RU" equals 60 min + 20% (.OTHER etc)', () => {
            expect(corr.getWorkTimestamp('ua', 1333, 'other')).toEqual(60 * 60 * 1000 * 1.2);
        });
        test('Count 1333+ symbols "UA/RU" equals 30 min + count / 22.2  (.DOC, .DOCX, .RTF)', () => {
            expect(corr.getWorkTimestamp('ua', 1334, 'doc')).toEqual(Math.ceil((30 + 1334 / 22.2) * 60 * 1000));
        });
        test('Count 1333+ symbols "UA/RU" equals (30 min + count / 22.2) + 20% (.OTHER etc)', () => {
            expect(corr.getWorkTimestamp('ua', 1334, 'other')).toEqual(Math.ceil((30 + 1334 / 22.2) * 1.2 * 60 * 1000));
        });

        test('Multiple time equals multiple single', () => {
            expect(corr.getWorkTimestamp('ua', 1001, 'doc|other')).toEqual(corr.getWorkTimestamp('ua', 1001, 'doc') + corr.getWorkTimestamp('ua', 1001, 'other'));
        });
    });

    describe('Deadline func:', () => {
        test('Deadline with 1 hour work equals (today hours || (today hours < 19) || 10) + 1', () => {
            const date = new Date(2023, 6, 28, 14, 39, 7);
            expect(new Date(corr.getDeadlineTimestamp(date.getTime(), 60 * 60 * 1000)).getUTCHours()).toEqual(date.getUTCHours() + 1);
        });
    });
});