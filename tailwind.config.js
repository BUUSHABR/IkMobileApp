module.exports = {
  content: ['./src/**/*.{html,js,tsx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'int-black': '#000000',
        'int-light-blue': '#ECEFF0',
        'int-grey-90': '#454950',
        'int-gray': '#E5E5E5',
        'int-grey-60': '#6F7782',
        'int-grey-40': '#9BA6B5',
        'int-grey-30': '#B2BAC6',
        'int-mid-blue': '#D3E4E8',
        'int-dark-blue': '#56A0BB',
        'int-very-dark-blue': '#498EA8',
        'int-green': '#B2DAA4',
        'int-dark-green': '#97D382',
        'int-dark': '#333333',
        'int-red': '#EB5757',
        'int-very-light-grey': '#FAFAFA',
      },
      fontSize: {
        button: ['14px', '22.4px'],
        link: ['16px', '25.6px'],
        'body-small': ['14px', '22.4px'],
        body: ['16px', '24px'],
        h3: ['16px', '21px'],
        h2: ['18px', '26.3px'],
        h1: ['24px', '31.2px'],
      },
      fontFamily: {
        BeVietnamBold: ['BeVietnamPro-Bold'],
        BeVietnamRegular: ['BeVietnamPro-Regular'],
      },
      boxShadow: {
        card: '0px 20px 44px #C9D3D7, 0px 1px 2px rgba(0, 0, 0, 0.15)',
        reactions:
          '0px 13px 14px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.15)',
        button: '0px 16px 26px -10px rgba(0, 0, 0, 0.25)',
      },
      dropShadow: {
        image: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
  corePlugins: require('tailwind-rn/unsupported-core-plugins'),
};
