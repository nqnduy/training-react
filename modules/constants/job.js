export const ApplicantStatus = {
    NEW: 1,
    REVIEWED: 2,
    APPOINTMENTED: 3,
    FAILED: 4,
    PASSED: 5,
};

export function ApplicantStatusTrans() {
    return {
        1: 'NEW',
        2: 'REVIEWED',
        3: 'APPOINTMENTED',
        4: 'FAILED',
        5: 'PASSED',
    };
}
