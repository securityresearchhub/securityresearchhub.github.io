const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * v2 Trigger: onCreate for blogPosts collection.
 * Automatically sends a push notification to all subscribers who have `subscribed: true`.
 */
exports.onNewBlogPost = onDocumentCreated("blogPosts/{blogId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        console.log("No snapshot data found");
        return;
    }

    const blogData = snapshot.data();
    const title = blogData.title || "New Security Research Published 🚀";
    const slug = blogData.slug;
    const blogUrl = `https://manivarmacyber.pages.dev/blog/${slug}`;

    try {
        // 1. Fetch all active subscribers
        // The user specified that subscribers have document ID = FCM token and field: subscribed: true
        const subscribersSnapshot = await admin.firestore()
            .collection('subscribers')
            .where('subscribed', '==', true)
            .get();

        const tokens = [];
        subscribersSnapshot.forEach(doc => {
            // Using document ID as the token as per project specification
            tokens.push(doc.id);
        });

        if (tokens.length === 0) {
            console.log("Found 0 active subscribers with subscribed: true.");
            return;
        }

        // 2. Construct Multicast Payload
        const message = {
            notification: {
                title: "New Security Research Published 🚀",
                body: title
            },
            webpush: {
                notification: {
                    click_action: blogUrl,
                    icon: "https://manivarmacyber.pages.dev/favicon.ico"
                }
            },
            tokens: tokens
        };

        // 3. Dispatch batch notifications
        const response = await admin.messaging().sendEachForMulticast(message);

        console.log(`Successfully dispatched ${response.successCount} notifications.`);

        // 4. Log telemetry for failures (invalid/stale tokens)
        if (response.failureCount > 0) {
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    const errorCode = resp.error?.code;
                    if (errorCode === 'messaging/registration-token-not-registered' ||
                        errorCode === 'messaging/invalid-registration-token') {
                        console.log(`Stale/Invalid token identified for removal: ${tokens[idx]}`);
                    } else {
                        console.error(`Notification failed for token ${tokens[idx]}:`, resp.error);
                    }
                }
            });
        }

    } catch (error) {
        console.error("CRITICAL: Automated blog notification trigger failed:", error);
    }
});

/**
 * v1 HTTP function remaining for manual tactical overrides if needed.
 */
const functions = require('firebase-functions');
exports.sendNotificationToAll = functions.https.onRequest(async (req, res) => {
    const messageBody = req.body.body || "New tactical research available.";
    try {
        const subscribersSnapshot = await admin.firestore().collection('subscribers').get();
        const tokens = [];
        subscribersSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.token) {
                tokens.push(data.token);
            }
        });
        if (tokens.length === 0) return res.status(200).send({ message: "No subscribers found.", successCount: 0 });
        const message = {
            notification: { title: "New Blog Published", body: messageBody },
            tokens: tokens
        };
        const response = await admin.messaging().sendEachForMulticast(message);
        return res.status(200).send({
            message: "Notifications dispatched successfully.",
            successCount: response.successCount,
            failureCount: response.failureCount
        });
    } catch (error) {
        console.error("Error sending notifications:", error);
        return res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
});
