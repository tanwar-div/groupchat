package com.example.repository;

import com.example.entity.Channel;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChannelRepository extends CrudRepository<Channel, Integer> {
    @Query(value = "SELECT c FROM Server s JOIN Channel c on s.serverID = c.server.serverID JOIN User u where u.JWT = :JWT")
    Optional<List<Channel>> findChannelsByJWT(@Param("JWT") String JWT);

    @Query(value = """
                SELECT c.*
                FROM user u join user_server us on u.userid=us.users_userid join server s on s.serverid=us.servers_serverid Join (user u2 join user_server us2 on u2.userid=us2.users_userid join server s2 on s2.serverid=us2.servers_serverid) on s.serverid=s2.serverid join channel c on c.server_serverid=s.serverid
                where (u.username=:userOne and u2.username=:userTwo) and s.server_name='@me'
            """,nativeQuery = true)
    Optional<Channel> findDirectMessageChannelByUsers(@Param("userOne") String userOne, @Param("userTwo") String userTwo);
}
