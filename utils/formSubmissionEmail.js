const React = require('react');
const { Html } = require('@react-email/html');

function formSubmissionEmail({ name, email, qualification }) {
  return React.createElement(
    Html,
    { dir: 'rtl' },
    React.createElement(
      'div',
      {
        style: {
          fontFamily: 'Arial, sans-serif',
          padding: '20px',
          maxWidth: '600px',
          margin: '0 auto',
        },
      },
      React.createElement(
        'h1',
        { style: { color: '#4CAF50' } },
        'سيرة ذاتية'
      ),
      React.createElement(
        'p',
        { style: { fontSize: '16px', lineHeight: '1.5' } },
        'لقد تم ارسال سيرة ذاتية حديدة لكم لضمها الى ملف المتاحين للعمل  بالتفاصيل التالية'
      ),
      React.createElement(
        'table',
        {
          style: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
          },
        },
        React.createElement(
          'tr',
          null,
          React.createElement(
            'td',
            {
              style: { border: '1px solid #ddd', padding: '8px' },
            },
            'الاسم:'
          ),
          React.createElement(
            'td',
            {
              style: { border: '1px solid #ddd', padding: '8px' },
            },
            name
          )
        ),
        React.createElement(
          'tr',
          null,
          React.createElement(
            'td',
            {
              style: { border: '1px solid #ddd', padding: '8px' },
            },
            'البريد الالكتروني:'
          ),
          React.createElement(
            'td',
            {
              style: { border: '1px solid #ddd', padding: '8px' },
            },
            email
          )
        ),
        React.createElement(
          'tr',
          null,
          React.createElement(
            'td',
            {
              style: { border: '1px solid #ddd', padding: '8px' },
            },
            'المؤهل:'
          ),
          React.createElement(
            'td',
            {
              style: { border: '1px solid #ddd', padding: '8px' },
            },
            qualification
          )
        )
      )
    )
  );
}

module.exports = formSubmissionEmail;
