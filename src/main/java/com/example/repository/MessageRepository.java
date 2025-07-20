package com.example.repository;

import com.example.entity.Message;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends ListCrudRepository<Message,Integer> {
    Optional<List<Message>> findMessagesByChannel_ChannelID(Integer channelID);
}
