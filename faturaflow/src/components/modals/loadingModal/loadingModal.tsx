
export const LoadingModal: React.FC = () => {

    return (
        <div>    
            <div className="z-50 flex fixed inset-0 min-h-screen items-center justify-center h-screen bg-gray-800 bg-opacity-50">
                <div className="loader border-8 border-t-8 border-gray-300 border-t-white rounded-full w-10 h-10 animate-spin"></div>
            </div>
        </div>
    );
};