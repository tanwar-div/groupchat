package com.example.util;

import com.example.entity.Channel;
import com.example.service.DatabaseService;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;

@Component
public class TopicSubscriptionInterceptor implements ChannelInterceptor {

    private static Logger logger = org.slf4j.LoggerFactory.getLogger(TopicSubscriptionInterceptor.class);

    @Autowired
    private DatabaseService databaseService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);
        if (StompCommand.SUBSCRIBE.equals(headerAccessor.getCommand())) {
            if (headerAccessor.getNativeHeader("authorization") == null) {
                return null;
            }
            List<Channel> usersChannels = databaseService.getUsersChannelsByJWT((Objects.requireNonNull(headerAccessor.getNativeHeader("authorization"))).get(0));
            String channelTryingToBeSubscribedTo = headerAccessor.getHeader("simpDestination").toString().split("/")[2];
            for (Channel c : usersChannels) {
                if (c.getChannelID().equals(Integer.parseInt(channelTryingToBeSubscribedTo))) {
                    return message;
                }
            }
            return null;
        }
        return message;
    }
}
