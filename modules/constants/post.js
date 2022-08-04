export const PostStatus = {
    NEW: 1,
    IN_REVIEW: 2,
    PUBLISHED: 3,
    IN_ACTIVE: 4,
    IN_DRAFT: 5,
};

export function PostStatusTrans() {
    return {
        1: 'NEW',
        2: 'IN-REVIEW',
        3: 'PUBLISHED',
        4: 'IN-ACTIVE',
        5: 'IN-DRAFT',
    };
}

export function ViewStatuses(user) {
    if (user.userPermission.isAdmin == true) return PostStatusTrans();
    if (!user.userPermission.permissions || !Object.keys(user.userPermission.permissions).length) return PostStatusTrans();
    let statues = {};
    let allowed = Object.keys(PostStatusTrans()).filter((k) => typeof user.userPermission.permissions[`post_view_status_${k}`] != 'undefined');
    allowed.forEach((k) => (statues[k] = PostStatusTrans()[k]));
    return statues;
}
