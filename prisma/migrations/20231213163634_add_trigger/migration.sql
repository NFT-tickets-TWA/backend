ALTER TABLE "Location"
    DROP COLUMN room;
create or replace function check_if_registration_opened() returns trigger as
$$
begin
    if exists(select * from "Event" where id = NEW.eventID and status = 'REGISTRATION_OPENED') then
        return new;
    else
        raise EXCEPTION 'registration must be opened if you want to register';
    end if;
end
$$
    language "plpgsql";

create or replace function check_before_approve()
    returns trigger as
$$
begin
    if OLD.status = 'REGISTERED' then
        return NEW;
    else
        return null;
    end if;
end;
$$
    language 'plpgsql';

create or replace function check_before_received_nft()
    returns trigger as
$$
begin
    if OLD.status = 'APPROVED' then
        return NEW;
    else
        return null;
    end if;
end;
$$
    language 'plpgsql';
create or replace function event_update_at()
    returns trigger as
$$
begin
    NEW.updatedAt = 'now';
end;
$$
    language 'plpgsql';
create or replace function check_before_create_location()
    returns trigger as
$$
begin
    if NEW.isOffline
    then
        if
            NEW.link is not null and NEW.address is null then
            return new;
        else
            raise exception 'if event is offline link must be not null and address is null';
        end if;
    else
        if
            NEW.address is not null and NEW.link is null then
            return new;
        else
            raise exception 'if event is not offline link must be null and address is not null';
        end if;
    end if;
end;
$$
    language 'plpgsql';

create
    or replace trigger check_approved
    before
        update
    on "ParticipantList"
    for each row
execute function
    check_before_approve();
create
    or replace trigger event_update_at
    before
        update
    on "Event"
    for each row
execute function
    event_update_at();
create
    or replace trigger before_create_location
    before
        insert
    on "Location"
    for each row
execute function
    check_before_create_location();
create
    or replace trigger check_received_aft
    before
        update
    on "ParticipantList"
    for each row
execute function
    check_before_received_nft();
create
    or replace trigger check_is_registration_opened
    before
        insert
    on "ParticipantList"
    for each row
execute function
    check_if_registration_opened();
-- This is an empty migration.