const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const userSchema = new Schema({
    nombre: {
        type: Schema.Types.String,
        trim: true,
        required: true,
    },
    usuario: {
        type: Schema.Types.String,
        unique: true,
        trim: true,
        required: true,
    },
    correo: {
        type: Schema.Types.String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
    },
    hashedContrasena: {
        type: Schema.Types.String,
        trim: true,
        required: false,
    },
    salt: {
        type: Schema.Types.String,
    },
    tokens: {
        type: [String],
        default: [],
    },
    roles: {
        type: [String], 
            default: []
    },
    /*avatar: {
        type: Schema.Types.String,
        required: true,
    },*/

},  {timestamps: true} );

userSchema.methods = {
    encryptContrasena: function (contrasena) {
        if (!contrasena) return '';

        try {
            const encryptedContrasena = crypto.pbkdf2Sync(
                contrasena,
                this.salt,
                1000,
                64,
                'sha512'
            ).toString('hex');

            return encryptedContrasena;
        } catch (error) {
            debug({ error });
            return '';
        }
    },
    makeSalt: function () {
        return crypto.randomBytes(16).toString('hex');
    },
    compareContrasena: function (contrasena) {
        return this.hashedContrasena === this.encryptContrasena(contrasena);
    },
};

userSchema.virtual('contrasena').set(function (contrasena = crypto.randomBytes(16).toString()) {
    if (!contrasena) return;

    this.salt = this.makeSalt();
    this.hashedContrasena = this.encryptContrasena(contrasena);
});

module.exports = mongoose.model('User', userSchema);
