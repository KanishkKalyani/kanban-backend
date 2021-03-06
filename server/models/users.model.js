const { model, Schema } = require("mongoose");
const crypto = require("crypto");

const UserSchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
			unique: true,
			max: 32,
		},
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true,
			lowercase: true,
		},
		hashed_password: {
			type: String,
			required: true,
		},
		salt: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			default: "Employee",
		},
		resetPasswordLink: {
			data: String,
			default: "",
		},
	},
	{ timestamps: true }
);

UserSchema.methods = {
	makeSalt: function () {
		return Math.round(new Date().valueOf() * Math.random() + "");
	},

	encryptPassword: function (password) {
		if (!password) return "";
		try {
			return crypto
				.createHmac("sha1", this.salt)
				.update(password)
				.digest("hex");
		} catch (error) {
			return error;
		}
	},

	authenticate: function (password) {
		return this.encryptPassword(password) === this.hashed_password;
	},
};

UserSchema.virtual("password")
	.set(function (password) {
		this._password = password;

		this.salt = this.makeSalt();

		this.hashed_password = this.encryptPassword(password);
	})
	.get(function () {
		return this._password;
	});

module.exports = model("User", UserSchema);
