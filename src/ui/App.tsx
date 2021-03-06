import React, { useCallback, useEffect, useRef, useState, MouseEvent } from 'react';
import './styles/style.scss';
import ParticlesLower from "./elements/decor/ParticlesLower";
import Main from "./Main";
import Header from "./Header";
import EpicBlock from "./elements/decor/EpicBlock";
import Footer from "./Footer";
import PreLoader from "./elements/decor/PreLoader";
import { useAppDispatch, useAppSelector, useWindowSize } from "../common/hooks";
import ParticlesUpper from "./elements/decor/ParticlesUpper";
import InfoSnackbar from "./elements/infoSnackbar/InfoSnackbar";
import { TEmailSendingStatus } from "../bll/reducers/contacts";
import ErrorSnackbar from "./elements/errorSnackbar/ErrorSnackbar";
import { setDeviceType, TDevice } from '../bll/reducers/app';
import { Sparks } from './elements/decor/Sparks';
import { INTERVAL } from '../common/consts';

function App() {
    const dispatch = useAppDispatch()
    const [height, setHeight] = useState(0)
    const size = useWindowSize()

    const device = useAppSelector<TDevice>(state => state.app.device)
    let isMobileMode = false
    if (device === "mobile" || device === "tablet") {
        isMobileMode = true
    }
    const error = useAppSelector<string>(state => state.contacts.emailFormErrorDescription)
    const info = useAppSelector<TEmailSendingStatus>(state => state.contacts.emailSendingStatus)

    const [loadingStages, incLoadingStages] = useState(0)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const loaded = () => {
        incLoadingStages(loadingStages + 1)
    }
    if (loadingStages === 14 && !isLoaded) {
        setIsLoaded(true)
    }
    const [scrollLastPosition, setScrollLastPosition] = useState(0)
    const [menuStatus, setMenuStatus] = useState(false)
    const toggleMenu = (status: boolean) => {
        setMenuStatus(status) 
        if (status) {  
            latestKnownScrollY.current && setScrollLastPosition(latestKnownScrollY.current)
            scrollLockRef.current = true
        }
    }
    const scrollToTargetSection = useCallback((y: number) => {
        window.scrollTo({top: y})
    }, [])
    useEffect(() => {
        if (!menuStatus) {
            scrollLockRef.current = false
            window.scrollTo({ top: scrollLastPosition })
        }
    }, [menuStatus])
    
    const ref = useRef<HTMLDivElement>(null)
    const offsetHeight = ref.current && ref.current.offsetHeight
    useEffect(() => {
        if (ref.current
            && ref.current.offsetHeight !== height
            && isLoaded) {
            setHeight(ref.current.offsetHeight)
        }
        setMenuStatus(false)

    }, [size, height, isLoaded, offsetHeight])

    useEffect(() => {
        // $md1: 1182;
        // $md2: 991.98;
        // $md3: 767.98;
        // $md5: 479.98;
        switch (true) {
            case size.width <= 479.98: {
                device !== 'mobile' && dispatch(setDeviceType('mobile'));
                break;
            }
            case size.width > 479.98 && size.width <= 767.98: {
                device !== 'tablet' && dispatch(setDeviceType('tablet'));
                break;
            }
            case size.width > 767.98 && size.width <= 991.98: {
                device !== 'laptop' && dispatch(setDeviceType('laptop'));
                break;
            }
            case size.width > 991.98: {
                device !== 'desktop' && dispatch(setDeviceType('desktop'));
                break;
            }
            // no default
        }
    }, [size.width]);

    // scrolling page processing
    const requestRef = useRef<number>();
    const previousTimeRef = useRef<number>();
    const paintBgQueueRef = useRef<(arg: number) => void | null>();
    const rotateQueueRef = useRef<(arg: number) => void | null>();
    const latestKnownScrollY = useRef<number>();
    const scrollLockRef = useRef<boolean>();

    const headerRef = useRef<HTMLDivElement>(null);
    const scrollContainerMain = useRef<HTMLDivElement>(null);
    const scrollContainerEpic = useRef<HTMLDivElement>(null);
    const scrollContainerFooter = useRef<HTMLDivElement>(null);
    const scrollData = {
        ease: isMobileMode ? 1 : 0.2,
        current: 0,
        previous: scrollLastPosition,
        rounded: 0
    }
    const timeData = {
        now: 0,
        previous: 0,
        delta: 0,
        ticking: false
    }
    const setPaintBgCallback = useCallback((callback: (arg: number) => void) => {
        paintBgQueueRef.current = callback
    }, [])
    const setRotateCallback = useCallback((callback: (arg: number) => void) => {
        rotateQueueRef.current = callback
    }, [])
    useEffect(() => {
        const onScroll = (e: Event) => {
            e.preventDefault();
            latestKnownScrollY.current = window.scrollY;
        }
        const onTouchMove = (e: Event) => {
            if (timeData.ticking) {
                e.preventDefault()
                return
            }
            timeData.ticking = true
        }
        latestKnownScrollY.current = 0;
        //window.addEventListener('scroll', onScroll);
        //window.addEventListener('touchmove', onTouchMove, { passive: false });
        // @ts-ignore
        const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame
        requestRef.current = requestAnimationFrame(render)
        return () => {
            cancelAnimationFrame(requestRef.current!);
            //window.removeEventListener("scroll", onScroll);
            //window.removeEventListener("touchmove", onTouchMove);
        }
    }, [])

    const onNavClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
        const section = document.getElementById(e.currentTarget.value)
        if (section && headerRef.current) {  
            if (menuStatus) {
                setMenuStatus(false)
                setScrollLastPosition(section.offsetTop - headerRef.current.offsetHeight)
            } else {
                scrollToTargetSection(section.offsetTop - headerRef.current.offsetHeight)
            }   
        }
    }, [menuStatus])
    const render = (now: number) => {
        latestKnownScrollY.current = window.scrollY;
        if (!previousTimeRef.current) {
            previousTimeRef.current = now
        }
        timeData.delta = now - previousTimeRef.current!;
        scrolling(timeData.delta)
        paintBgQueueRef.current && paintBgQueueRef.current(timeData.delta)
        if (!scrollLockRef.current && typeof latestKnownScrollY.current === "number") {
            rotateQueueRef.current && rotateQueueRef.current(latestKnownScrollY.current)
        }  
        requestRef.current = requestAnimationFrame(render)
        
        if (timeData.delta > INTERVAL) {
            timeData.ticking = false
            previousTimeRef.current = now - Math.round(timeData.delta % INTERVAL);
        }
    }

    const scrolling = (deltaTime: number) => {
        if (deltaTime < INTERVAL) return
        const scrollY = latestKnownScrollY.current;

        if (scrollLockRef.current) {
            return
        }
        else {         
            scrollData.current = scrollY!
            if (scrollData.current !== Math.round(scrollData.previous)) {
                scrollData.previous += (scrollData.current - scrollData.previous) * scrollData.ease
            }
        }
        scrollData.rounded = Math.round(scrollData.previous * 100) / 100
        if (scrollData.current !== Math.round(scrollData.previous)
            && scrollContainerMain.current
            && scrollContainerEpic.current
            && scrollContainerFooter.current) {
            scrollContainerMain.current.style.willChange = "transform"
            scrollContainerMain.current.style.transform = `translate3d(0, -${scrollData.rounded}px, 0)`
            scrollContainerEpic.current.style.willChange = "transform"
            scrollContainerEpic.current.style.transform = `translate(0, -${scrollData.rounded}px)`
            scrollContainerFooter.current.style.willChange = "transform"
            scrollContainerFooter.current.style.transform = `translate(0, -${scrollData.rounded}px)`
        } else {
            if (scrollContainerMain.current) {
                scrollContainerMain.current.style.willChange = "auto"
            }
            if (scrollContainerEpic.current) {
                scrollContainerEpic.current.style.willChange = "auto"
            }
            if (scrollContainerFooter.current) {
                scrollContainerFooter.current.style.willChange = "auto"
            }
        }
    }

    const containerTransition = isMobileMode ? 'all 100ms cubic-bezier(0.3, 1, 1, 1)' : 'all 500ms cubic-bezier(0.3, 1, 1, 1)';
    return (
        <div style={menuStatus
            ? { height: `${height}px`, position: 'fixed', overflowY: 'hidden' }
            : { height: `${height}px`, }}>
            {info !== 'Idle' && <InfoSnackbar info={info} />}
            <ErrorSnackbar error={error} />
            <div ref={ref} className="wrapper" style={menuStatus && !isMobileMode
                ? { paddingRight: '17px', }
                : {}}>
                <div ref={headerRef} className="header__container">
                    <Header loaded={loaded}
                        isLoaded={isLoaded}
                        toggleMenu={toggleMenu}
                        menuStatus={menuStatus}
                        onNavClick={onNavClick} />
                </div>
                <div ref={scrollContainerMain}
                    style={{ transition: containerTransition, zIndex: 2 }}>
                    <Main loaded={loaded}
                        isLoaded={isLoaded}
                        menuStatus={menuStatus}
                        setCallback={setRotateCallback}
                        onScrollToSectionClick={onNavClick} />
                </div>
                <div ref={scrollContainerEpic}
                    style={{ transition: containerTransition, zIndex: 0 }}>
                    <EpicBlock loaded={loaded} />
                </div>
                <div ref={scrollContainerFooter}
                    style={{ transition: containerTransition, zIndex: 5 }}>
                    <Footer />
                </div>

                {!isLoaded && <PreLoader />}
                <Sparks isMobileMode={isMobileMode} setCallback={setPaintBgCallback} />
                <ParticlesLower />
                <ParticlesUpper />
            </div>
        </div>
    )
}

export default App;
