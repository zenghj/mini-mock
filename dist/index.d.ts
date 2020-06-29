interface MockOption {
    entry: string;
}
export declare function mock(option: MockOption): (req: any, res: any, next: any) => any;
export {};
