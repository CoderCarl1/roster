export function joinClasses(...args: (string | undefined | null)[]): string {
    const validClasses = args.filter(
        (arg) => typeof arg === 'string' && arg.trim() !== ''
    );
    return validClasses.join(' ');
}
