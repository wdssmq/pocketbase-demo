import antfu from '@antfu/eslint-config';

export default antfu({
    // formatters: true,
    rules: {
        'node/prefer-global/process': ['off'],
        'style/indent': ['error', 4],
        'style/semi': ['error', 'always'],
    },
});
