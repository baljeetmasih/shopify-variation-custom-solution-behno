import React from 'react';
import {VerticalStack, Spinner} from '@shopify/polaris';


function C_loader() {
  return (
    <>
    <SpacingBackground>
      <VerticalStack gap="500">
        <Spinner />
      </VerticalStack>
    </SpacingBackground>
    </>
  );
}

const SpacingBackground = ({children}) => {
  return (
    <div
      style={{
        height: '100%',
        width : '100%',
        background : 'rgba(0,0,0,0.2)'
      }}
      className='tmb_main_loder_block'
    >
      {children}
    </div>
  );
};
export default C_loader