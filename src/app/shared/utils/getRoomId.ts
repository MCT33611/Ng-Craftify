export function getRoomId(userId1: string, userId2: string): string {
    return compareGuids(userId1, userId2) < 0
        ? `${userId1}-${userId2}`
        : `${userId2}-${userId1}`;
}

function compareGuids(guid1: string, guid2: string): number {
    if (guid1 < guid2) return -1;
    if (guid1 > guid2) return 1;
    return 0;
}
