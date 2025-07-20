package com.example.repository;


import com.example.entity.Server;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServerRepository extends ListCrudRepository<Server,Integer> {
    Optional<Server> findServerByInvites_InviteCode(String inviteCode);
}
