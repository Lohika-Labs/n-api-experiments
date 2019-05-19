{
  'targets': [
    {
      'target_name': 'module',
      'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions' ],
      'sources': [ './src/module.cc' ],
      'include_dirs': [
        '<!@(node -p \'require("node-addon-api").include\')'
      ],
      'libraries': [
        '<!(pkg-config opencv --libs)'
      ],
      'dependencies': [
        '<!(node -p \'require("node-addon-api").gyp\')'
      ],
      'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
      'conditions': [
        [
          'OS==\'mac\'', {
            'xcode_settings': {
              'OTHER_CFLAGS': [
                '-mmacosx-version-min=10.7',
                '-std=c++11',
                '-stdlib=libc++',
                '<!(pkg-config opencv --cflags)'
              ],
              'GCC_ENABLE_CPP_RTTI': 'YES',
              'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
            }
          }
        ]
      ]
    }
  ]
}

