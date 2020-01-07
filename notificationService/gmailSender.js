const fs = require('fs');
const {google} = require('googleapis');

class GmailSender {

    static send(email, dataEmail) {
        try {
            const gmailClient = GmailClient.getGmailClient();
            gmailClient.users.messages.send(
                {
                    userId: 'me',
                    requestBody: {
                        raw: this.createMessage(email, dataEmail.subject, dataEmail.message, dataEmail.from),
                    },
                }
            );
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    static createMessage(email, subject, emailBody, from) {
        // You can use UTF-8 encoding for the subject using the method below.
        // You can also just use a plain string if you don't need anything fancy.
        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        // const authorEmail = 'mariaanavqz@gmail.com'; // Si machea con el usuario 'real' te pone el nombre del FROM
        const authorEmail ="unqqqqqqq";
        const receiver = email.substr(0, email.indexOf('@'));
        const messageParts = [
          'From: '+from+'<'+authorEmail+'>',
          'To: '+receiver+' <'+email+'>',
          'Content-Type: text/html; charset=utf-8',
          'MIME-Version: 1.0',
          `Subject: ${utf8Subject}`,
          '',
          emailBody,
        ];
        const message = messageParts.join('\n');
      
        // The body needs to be base64url encoded.
        const encodedMessage = Buffer.from(message)
          .toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
      
        return encodedMessage;
    }
}

class GmailClient {
    /** exclusivo manejo de autorizaciones(?) */
    static credentials_path() { return 'credentials.json'}
    static token_path() { return 'token.json' }

    static getGmailClient() {
        const credentials = fs.readFileSync(this.credentials_path());
        const token = fs.readFileSync(this.token_path())
        const oauthClient = this.getOAuthClient(this.makeCredentials(credentials, token));
        return google.gmail({version: 'v1', auth: oauthClient});
    }

    static makeCredentials(credentials, token) {
        return {
            params: JSON.parse(credentials).installed,
            token: JSON.parse(token),
        };
    }

    static getOAuthClient(credentials) {
        let oAuth2Client = new google.auth.OAuth2(
            credentials.params.client_id,
            credentials.params.client_secret,
            credentials.params.redirect_uris[0]
        );
        oAuth2Client.setCredentials(credentials.token);
        return oAuth2Client;
    }

}

module.exports = {
    GmailSender,
};
