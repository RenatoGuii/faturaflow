interface FieldErrorProps {
    error: any | null
}

export const FieldError: React.FC<FieldErrorProps> = ({error}: FieldErrorProps) => {

    if(error) {
        return (
            <p className="text-red-500 text-sm mt-1" >{error}</p>
        )
    }

    return false;
}