module.exports = {
  purge: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'space-gtotesk-light': 'Space Gtotesk Light',
        'space-gtotesk-medium': 'Space Gtotesk Medium',
        'space-gtotesk-semiBold': 'Space Gtotesk SemiBold',
        'space-gtotesk-bold': 'Space Gtotesk Bold',
        'space-grotesk-regular': 'Space Grotesk Regular'
      },
      fontSize: {
        '120px': ['120px', '128px'],
        '88px': ['88px', '96px'],
        '64px': ['64px', '72px'],
        '48px': ['48px', '56px'],
        '36px': ['36px', '44px'],
        '32px': ['32px', '40px'],
        '30px': ['30px', '38px'],
        '28px': ['28px', '36px'],
        '18px': ['18px', '26px'],
        '14px': ['14px', '22px'],
        '12px': ['12px', '20px']
      },
      width: {
        '1342px': '1342px',
        '1264px': '1264px',
        '1200px': '1200px',
        '1024px': '1024px',
        '440px': '440px',
        '300px': '300px',
        '282px': '282px',
        '279px': '279px',
        '200px': '200px',
        '164px': '164px',
        '120px': '120px',
        '100px': '100px',
        '49%': '49%',
        '43%': '43%'
      },
      minWidth: {
        '279px': '279px',
        '198px': '198px',
        '164px': '164px',
        '160px': '160px',
        '158px': '158px',
        '145px': '145px',
        '8px': '8px'
      },
      height: {
        '528px': '528px',
        '310px': '310px',
        '250px': '250px',
        '120px': '120px',
        '100px': '100px'
      },
      maxWidth: {
        '1200px': '1200px',
        '480px': '480px',
        '440px': '440px'
      },
      minHeight: {
        '44px': '44px'
      },
      spacing: {
        '40%': '40%',
        '280px': '280px',
        '258px': '258px',
        '148px': '148px',
        '88px': '88px',
        '72px': '72px',
        '70px': '70px',
        '54px': '54px',
        '50px': '50px',
        '10px': '10px',
        '9px': '9px'
      },
      colors: {
        permaMain: '#161E1B',
        permaGrey: 'rgba(233, 233, 233, 0.5)',
        permaGray1: '#5D806E',
        permaGray2: '#CACACA',
        permaGray3: '#B8B8B8',
        permaGray4: 'rgba(218,218,218,0.85)',
        permaBlack: '#000A06',
        permaBlack1: 'rgba(22, 30, 27, 0.45)',
        permaBlack2: '#183B21',
        permaBlack3: '#222422',
        permaBlack4: '#141814',
        permaBlack5: '#242D2A',
        permaGreen: '#183B21',
        permaGreen1: 'rgba(24, 59, 33, 0.25)',
        permaGreen2: 'rgb(121, 212, 131)',
        permaGreen3: '#363F3B',
        permaGreen4: '#79D483',
        permaGreen5: 'rgba(54, 63, 59, 0.85)',
        permaGreen6: 'rgba(22, 30, 27, 0.65)',
        permaGreen7: '#52C763',
        permaGreen8: 'rgba(24, 59, 33, 0.65)',
        permaGreen9: '#5AAD67',
        permaGreen10: '#296135',
        permaGreen11: '#A4E0A9',
        permaGreen12: 'rgba(24, 59, 33, 0.85)',
        permaGreen13: 'rgba(22, 30, 27, 0.45)',
        permaGreen14: '#363F3B',
        permaWhite: 'rgba(255, 255, 255, 0.2)',
        permaWhite1: 'rgba(255, 255, 255, 0.85)',
        permaWhite2: 'rgba(255, 255, 255, 0.65)',
        permaWhite3: 'rgba(255, 255, 255, 0.45)',
        permaWhite4: 'rgba(255, 255, 255, 0.15)',
        permaWhite5: 'rgba(255, 255, 255, 0.08)',
        permaWhite6: 'rgba(255, 255, 255, 0.55)',
        permaWhite7: '#31335B',
        permaYellow: '#D3B078',
        permaYellow2: '#E0CBA4',
        permaYellow3: '#AD8B5A',
        permaYellow4: '#FFC53D',
        permaPurple: 'linear-gradient(151.4deg, rgba(99, 51, 170, 0.45) 0%, rgba(43, 80, 170, 0.45) 95.73%)',
        permaRed: '#FF7D69',
        permaHoverGreen: '#AECCAD'
      },
      backgroundImage: {
        permaGreenBg:
          'linear-gradient(268.01deg, rgba(41, 41, 41, 0.8) -9.16%, rgba(51, 51, 51, 0.8) 109.32%);'
      },
      screens: {
        mb: '500px'
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite'
      },
      opacity: {
        8: '.08',
        12: '.12',
        45: '.45',
        65: '.65',
        85: '.85'
      }
    }
  },
  variants: {
    extend: {
      borderWidth: ['last'],
      padding: ['last'],
      margin: ['last', 'first'],
      width: ['last'],
      textColor: ['active'],
      backgroundColor: ['active'],
      borderColor: ['active'],
      backgroundOpacity: ['active']
    }
  },
  plugins: []
}
