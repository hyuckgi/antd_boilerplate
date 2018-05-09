import React from 'react';
import { Link } from 'react-router-dom';


import { DesktopLayout, MobileLayout } from '../response';

import { Carousel as WebCarousel } from 'antd';

import { Carousel as MobileCarousel, WingBlank } from 'antd-mobile';


// {this.state.data.map(val => (
//     <a
//         key={val}
//         href="http://www.alipay.com"
//         style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
//     >
//         <img
//             src={`https://zos.alipayobjects.com/rmsportal/${val}.png`}
//             alt=""
//             style={{ width: '100%', verticalAlign: 'top' }}
//             onLoad={() => {
//                 // fire window resize event to change height
//                 window.dispatchEvent(new Event('resize'));
//                 this.setState({ imgHeight: 'auto' });
//             }}
//         />
//     </a>
// ))}

class CommonSlider extends React.Component {

    render() {
        const { data } = this.props;

        return (
            <div className="common-slider">
                <DesktopLayout>
                    <WebCarousel
                        autoplay
                    >
                        {data.map((item, inx) => {
                            return (
                                <div key={inx}>
                                    <Link
                                        key={item.id}
                                        to={item.link}
                                        target="_self"
                                    >
                                        <img
                                            src={item.url}
                                            alt={item.text}
                                            onLoad={() => {
                                                window.dispatchEvent(new Event('resize'));
                                            }}
                                        />
                                    </Link>
                                </div>
                            );
                        })}
                    </WebCarousel>
                </DesktopLayout>
                <MobileLayout>
                    <MobileCarousel
                        autoplay={true}
                        infinite
                        beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                        afterChange={index => console.log('slide to', index)}
                    >
                        {data.map((item, inx) => {
                            return (
                                <Link
                                    key={item.id}
                                    to={item.link}
                                    target="_self"
                                >
                                    <img
                                        src={item.url}
                                        alt={item.text}
                                        onLoad={() => {
                                            window.dispatchEvent(new Event('resize'));
                                        }}
                                    />
                                </Link>
                            );
                        })}
                    </MobileCarousel>
                </MobileLayout>
            </div>
        );
    }

}

export default CommonSlider;
