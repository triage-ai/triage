import { createContext, useState } from "react";


export const DrawerContext = createContext();

export const DrawerProvider = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    return (
        <DrawerContext.Provider value={{
            mobileOpen,
            handleDrawerClose,
            handleDrawerTransitionEnd,
            handleDrawerToggle
        }}>
            {children}
        </DrawerContext.Provider>
    )
}