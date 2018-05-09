import React from 'react';

import { DesktopLayout, MobileLayout } from '../../commons/components/response';

import { Spin } from 'antd';
import { ActivityIndicator } from 'antd-mobile';

class Spinner extends React.Component {

    render() {
        const { tip, spinning, children, toast } = this.props;

        return (
            <div className="spinning-wrapper">
                <DesktopLayout>
                    <Spin tip={tip} spinning={spinning}>
                        {children}
                    </Spin>
                </DesktopLayout>
                <MobileLayout>
                    <ActivityIndicator
                        toast={toast}
                        text={tip}
                        animating={spinning}
                    />
                </MobileLayout>
            </div>

        );
    }
}

export default Spinner;
