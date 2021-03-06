import React, {CSSProperties, FC, SyntheticEvent} from 'react';
import fire from "assets/fire.mp4";
import {useInView} from "react-intersection-observer";
import frame1 from "assets/epic/pre_frame1.png"
import frame2 from "assets/epic/pre_frame2.png"
import frame3 from "assets/epic/pre_frame3.png"
import frame4 from "assets/epic/pre_frame4.png"
import frame5 from "assets/epic/pre_frame5.png"
import frame6 from "assets/epic/pre_frame6.png"
import frame7 from "assets/epic/pre_frame7.png"
import frame8 from "assets/epic/pre_frame8.png"
import frame9 from "assets/epic/pre_frame9.png"
import frame10 from "assets/epic/pre_frame10.png"
import frame11 from "assets/epic/pre_frame11.png"
import { useCallback } from 'react';

type TEpicBlockProps = {
    loaded: () => void
}
const EpicBlock: FC<TEpicBlockProps> = ({loaded}) => {

    const {ref, inView} = useInView({
        threshold: 0.3
    })
    const frames = [
        {
            id: 1,
            imgSrc: frame1,
            imgAlt: '1',
        },
        {
            id: 2,
            imgSrc: frame2,
            imgAlt: '2',
        },
        {
            id: 3,
            imgSrc: frame3,
            imgAlt: '3',
        },
        {
            id: 4,
            imgSrc: frame4,
            imgAlt: '4',
        },
        {
            id: 5,
            imgSrc: frame5,
            imgAlt: '5',
        },
        {
            id: 6,
            imgSrc: frame6,
            imgAlt: '6',
        },
        {
            id: 7,
            imgSrc: frame7,
            imgAlt: '7',
        },
        {
            id: 8,
            imgSrc: frame8,
            imgAlt: '8',
        },
        {
            id: 9,
            imgSrc: frame9,
            imgAlt: '9',
        },
        {
            id: 10,
            imgSrc: frame10,
            imgAlt: '10',
        },
        {
            id: 11,
            imgSrc: frame11,
            imgAlt: '11',
        },
    ].map(fr => (
        <span key={fr.id} className="epic__hero__frame">
            <img src={fr.imgSrc} alt={fr.imgAlt} onLoad={loaded}/>
        </span>))
    
    const onVideoLoad = useCallback((e: SyntheticEvent<HTMLVideoElement>) => {
        loaded();
        //e.currentTarget.play();
    }, [])
    return (
        <div ref={ref} className="epic__block">
            <div className="epic">
                <div className="epic__hero">
                    <div style={inView ? {} : {animationName: 'none'}}
                         className="epic__hero__frames">
                        {frames}
                    </div>
                </div>
                <video id="epic-fire" className="epic__fire" muted loop autoPlay playsInline onLoadedData={onVideoLoad}>
                    <source src={fire} type='video/mp4'/>
                </video>
                <div className="epic__gradient"> </div>
            </div>
        </div>
    )
}

export default EpicBlock